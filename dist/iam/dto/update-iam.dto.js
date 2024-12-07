"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIamDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_iam_dto_1 = require("./create-iam.dto");
class UpdateIamDto extends (0, mapped_types_1.PartialType)(create_iam_dto_1.CreateIamDto) {
}
exports.UpdateIamDto = UpdateIamDto;
//# sourceMappingURL=update-iam.dto.js.map