const { sort } = require("../../utils/functions");

describe("Test the methos sort", () => {

  test('Should get an object orderd by Keys field _<number>', () => {
    const object = {
      field_2: "value_21",
      field_1: "value_11",
      field_3: "value_31",
      field_4: "value_41",
    }
    const objectExpected = {
      field_1: "value_11",
      field_2: "value_21",
      field_3: "value_31",
      field_4: "value_41",
    }
    expect(sort(object)).toMatchObject(objectExpected);
  });

  test('Should get an object orderd by Keys <letter>_field_<number>', () => {
    const object = {
      x_field_2: "value_21",
      g_field_1: "value_11",
      d_field_3: "value_31",
      s_field_4: "value_41",
    }
    const objectExpected = {
      d_field_3: "value_31",
      g_field_1: "value_11",
      s_field_4: "value_41",
      x_field_2: "value_21",
    }
    expect(sort(object)).toMatchObject(objectExpected);
  });
})