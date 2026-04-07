"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sliders_service_1 = require("./sliders.service");
describe('SlidersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [sliders_service_1.SlidersService],
        }).compile();
        service = module.get(sliders_service_1.SlidersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=sliders.service.spec.js.map