import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;
    const incomeTransactions = await this.find({
      where: { type: 'income' },
    });
    if (incomeTransactions.length) {
      income = incomeTransactions
        .map(transaction => parseFloat(transaction.value.toString()))
        .reduce((accumulator, value) => accumulator + value);
    }

    const outcomeTransactions = await this.find({
      where: { type: 'outcome' },
    });
    if (outcomeTransactions.length) {
      outcome = outcomeTransactions
        .map(transaction => parseFloat(transaction.value.toString()))
        .reduce((accumulator, value) => accumulator + value);
    }
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public async getAll(): Promise<Transaction[]> {
    const transactions = await this.find({
      relations: ['category'],
      select: ['id', 'title', 'value', 'category', 'created_at', 'updated_at'],
    });
    return transactions;
  }
}

export default TransactionsRepository;
