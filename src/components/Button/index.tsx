import Link from "next/link";
import type { FC } from "react";

import { classNames } from "../../utils";

import styles from "./Button.module.scss";

type ButtonProps = {
  className?: string;
  variant?: "contained" | "outlined";
  as?: "button" | "link";
  buttonType?: "button" | "submit" | "reset";
  linkHref?: string;
};

const Button: FC<ButtonProps> = function ButtonComponent({
  children,
  className,
  variant = "contained",
  as = "button",
  buttonType = "button",
  linkHref = "/",
}) {
  const classNameList = [styles.button, styles[variant], className];

  switch (as) {
    case "button":
      return (
        <button {...classNames(classNameList)} type={buttonType}>
          {children}
        </button>
      );

    case "link":
      return (
        <Link passHref href={linkHref}>
          <a {...classNames(classNameList)}>{children}</a>
        </Link>
      );
  }
};

export default Button;
