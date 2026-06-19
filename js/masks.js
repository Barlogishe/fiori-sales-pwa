function setupTimeMask() {

  const input =
    document.getElementById(
      "pickupTime"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      value =
        value.slice(0, 4);

      if (
        value.length > 2
      ) {

        value =
          value.slice(0, 2)
          + ":"
          + value.slice(2);

      }

      e.target.value =
        value;

    }
  );

}

function setupPhoneMask() {

  const input =
    document.getElementById(
      "customerPhone"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      if (
        value.startsWith("8")
      ) {

        value =
          "7" +
          value.slice(1);

      }

      if (
        !value.startsWith("7")
      ) {

        value =
          "7" + value;

      }

      value =
        value.slice(0, 11);

      let formatted =
        "+7";

      if (value.length > 1) {

        formatted +=
          " (" +
          value.slice(1, 4);

      }

      if (value.length >= 4) {

        formatted +=
          ") " +
          value.slice(4, 7);

      }

      if (value.length >= 7) {

        formatted +=
          "-" +
          value.slice(7, 9);

      }

      if (value.length >= 9) {

        formatted +=
          "-" +
          value.slice(9, 11);

      }

      e.target.value =
        formatted;

    }
  );

}

function setupDateMask() {

  const input =
    document.getElementById(
      "pickupDate"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      value =
        value.slice(0, 8);

      if (value.length > 4) {

        value =
          value.slice(0, 2)
          + "."
          + value.slice(2, 4)
          + "."
          + value.slice(4);

      } else if (
        value.length > 2
      ) {

        value =
          value.slice(0, 2)
          + "."
          + value.slice(2);

      }

      e.target.value =
        value;

    }
  );

}