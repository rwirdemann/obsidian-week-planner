import {WEEK_PLANNER_BASE_DIR, WEEK_PLANNER_DAYS_DIR} from "./constants";

export interface WeekPlannerPluginSettings {
	workingDays: string;
	baseDir: string
	daysDir: string
}

export const DEFAULT_SETTINGS: WeekPlannerPluginSettings = {
	workingDays: 'Mon,Tue,Wed,Thu,Fri',
	baseDir: WEEK_PLANNER_BASE_DIR,
	daysDir: WEEK_PLANNER_DAYS_DIR
}
