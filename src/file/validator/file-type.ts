import ValidatorComposer from '@validator/common.validator';
import { IsString, Matches } from 'class-validator';

function IsFileType(
  { required }: { required: boolean } = { required: false },
): PropertyDecorator {
  return ValidatorComposer([IsString(), Matches(/image|html|json|submission/)])(
    {
      required,
    },
  );
}

export default IsFileType;
