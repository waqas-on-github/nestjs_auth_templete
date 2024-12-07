import { CreateIamDto } from './dto/create-iam.dto';
import { UpdateIamDto } from './dto/update-iam.dto';
export declare class IamService {
    create(createIamDto: CreateIamDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateIamDto: UpdateIamDto): string;
    remove(id: number): string;
}
