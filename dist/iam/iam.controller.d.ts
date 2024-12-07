import { IamService } from './iam.service';
import { CreateIamDto } from './dto/create-iam.dto';
import { UpdateIamDto } from './dto/update-iam.dto';
export declare class IamController {
    private readonly iamService;
    constructor(iamService: IamService);
    create(createIamDto: CreateIamDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateIamDto: UpdateIamDto): string;
    remove(id: string): string;
}
