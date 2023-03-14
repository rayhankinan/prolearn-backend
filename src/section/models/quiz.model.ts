import { ChildEntity, Column } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('quiz')
class QuizEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.QUIZ })
  readonly type: SectionType;
}

export default QuizEntity;
