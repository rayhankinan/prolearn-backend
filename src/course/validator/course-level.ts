import ValidatorComposer from '@validator/common.validator';
import { IsString, Matches } from 'class-validator';

function IsCourseLevel(
  { required }: { required: boolean } = { required: false },
): PropertyDecorator {
  return ValidatorComposer([
    IsString(),
    Matches(/beginner|intermediate|advanced/)
  ])({ required });
}

export default IsCourseLevel;
