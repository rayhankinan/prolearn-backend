import { ValidatorComposer } from "src/validator/common.validator";
import { IsString, Matches } from "class-validator";

export function IsSectionType({ required }: { required: boolean } = { required: false }): PropertyDecorator {
  return ValidatorComposer([
      IsString(),
      Matches(/QUIZ|MATERIAL|PROJECT/)
  ])({ required });
}