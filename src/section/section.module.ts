import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import SectionService from './services/section.service';
