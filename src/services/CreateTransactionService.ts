import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const typeToLower = type.toLowerCase();
    if (!(typeToLower === 'income' || typeToLower === 'outcome')) {
      throw new AppError(`Invalid transaction type: ${type}.`);
    }
    if (typeToLower === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (value > total) {
        throw new AppError('Forbidden transaction');
      }
    }
    const categoryRepository = getRepository(Category);
    let existentCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!existentCategory) {
      existentCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(existentCategory);
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type: typeToLower,
      category_id: existentCategory.id,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
