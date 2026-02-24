import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './shemas/user.shema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Créer un utilisateur
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({ ...createUserDto, password: hashedPassword });
    return user.save();
  }

  // Lister tous les utilisateurs
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Trouver par ID
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Mettre à jour un utilisateur
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Supprimer un utilisateur
  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }

  // Trouver un utilisateur par email (pour Auth)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}