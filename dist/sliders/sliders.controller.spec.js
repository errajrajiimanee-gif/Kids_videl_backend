"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sliders_controller_1 = require("./sliders.controller");
describe('SlidersController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [sliders_controller_1.SlidersController],
        }).compile();
        controller = module.get(sliders_controller_1.SlidersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=sliders.controller.spec.js.map