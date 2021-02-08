import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  transaction_id: string;
}
class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne(transaction_id);
    if (!transaction) {
      throw new AppError(`Transaction ${transaction_id} does not exists`, 404);
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
