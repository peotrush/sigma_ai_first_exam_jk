import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

/**
 * User Entity
 * Represents a Kash Budget user account
 * Maps to 'users' table in PostgreSQL
 */
@Entity('users')
@Index('idx_users_email', ['email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255, unique: true })
  email!: string;

  @Column('varchar', { length: 255 })
  passwordHash!: string;

  @Column('varchar', { length: 100, nullable: true })
  firstName?: string;

  @Column('varchar', { length: 100, nullable: true })
  lastName?: string;

  @Column('boolean', { default: false })
  emailVerified!: boolean;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: true,
    eager: false,
  })
  transactions?: Transaction[];
}
