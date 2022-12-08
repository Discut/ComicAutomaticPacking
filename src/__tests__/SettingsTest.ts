import { Setting } from "../config/setting";

test("测试Settings", () => {
    let set: Setting = Setting.instance();
    set.init();
    set.outputPath = "Z:\\comic\\h";
    expect(set.isProxy).toBe(false);
    expect(set.timeout).toBe("5000");
    expect(set.outputPath).toBe("Z:\\comic\\h")
    //expect(Greeter('Carl')).toBe('Hello Carl');

})