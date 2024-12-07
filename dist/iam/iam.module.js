"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const iam_service_1 = require("./iam.service");
const iam_controller_1 = require("./iam.controller");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const google_strategy_1 = require("./stratiges/google.strategy");
let IamModule = class IamModule {
};
exports.IamModule = IamModule;
exports.IamModule = IamModule = __decorate([
    (0, common_1.Module)({
        controllers: [iam_controller_1.IamController],
        providers: [
            iam_service_1.IamService,
            config_1.ConfigService,
            google_strategy_1.GoogleStrategy,
        ],
        imports: [passport_1.PassportModule.register({ defaultStrategy: 'google' })],
    })
], IamModule);
//# sourceMappingURL=iam.module.js.map