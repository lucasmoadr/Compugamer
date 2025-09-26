export * from './bus.service';
import { BusService } from './bus.service';
export * from './driver.service';
import { DriverService } from './driver.service';
export * from './student.service';
import { StudentService } from './student.service';
export const APIS = [BusService, DriverService, StudentService];
