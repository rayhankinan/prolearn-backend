import { ValidatorComposer } from "src/validator/common.validator";
import { IsString, Matches } from "class-validator";

export function IsCourseLevel({ required }: { required: boolean } = { required: false }): PropertyDecorator {
  return ValidatorComposer([
      IsString(),
      Matches(/BEGINNER|INTERMEDIATE|ADVANCED/)
  ])({ required });
}

export function IsCourseStatus({ required }: { required: boolean } = { required: false }): PropertyDecorator {
  return ValidatorComposer([
      IsString(),
      Matches(/ACTIVE|INACTIVE/)
  ])({ required });
}