import ValidatorComposer from '@validator/common.validator';
import { IsString, Matches } from 'class-validator';

function IsExtensionType(
  { required }: { required: boolean } = { required: false },
) {
  return ValidatorComposer([IsString(), Matches(/cpp|c|py|js/)])({
    required,
  });
}

export default IsExtensionType;
