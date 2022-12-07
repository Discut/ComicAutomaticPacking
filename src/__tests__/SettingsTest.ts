import { Setting } from "../config/setting";

test("测试Settings",() => {
    let set: Setting = new Setting;
    set.init();
    expect(set.isProxy).toBe(true);
    expect(set.timeout).toBe("5000");
    //expect(Greeter('Carl')).toBe('Hello Carl');

})