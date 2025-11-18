import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';

export enum TransactionSource {
  QR_SCAN = 'qr_scan',
  MANUAL = 'manual',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity('transactions')
@Index('idx_user_timestamp', ['userId', 'timestamp'])
@Index('idx_user_created', ['userId', 'createdAt'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount!: number;

  @Column('timestamp with time zone')
  timestamp!: Date;

  @Column('varchar', { length: 50, nullable: true })
  category!: string | null;

  @Column('geometry', { nullable: true, spatialFeatureType: 'Point' })
  location!: string | null;

  @Column('enum', {
    enum: TransactionSource,
    default: TransactionSource.MANUAL,
  })
  source!: TransactionSource;

  @Column('enum', {
    enum: TransactionType,
    default: TransactionType.EXPENSE,
  })
  type!: TransactionType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
