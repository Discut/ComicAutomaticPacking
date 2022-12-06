import { Greeter, Printf } from '../index';

test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});


test("打印输出", ()=>{
    expect(Printf("ABC")).toBeUndefined();
})