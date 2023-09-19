import {WEEK_PLANNER_BASE_DIR, WEEK_PLANNER_DAYS_DIR, WEEK_WEEK_DIR} from "./constants";

export interface WeekPlannerPluginSettings {
	workingDays: string;
	baseDir: string
	daysDir: string
	weeksDir: string
}

export const DEFAULT_SETTINGS: WeekPlannerPluginSettings = {
	workingDays: 'Mon,Tue,Wed,Thu,Fri',
	baseDir: WEEK_PLANNER_BASE_DIR,
	daysDir: WEEK_PLANNER_DAYS_DIR,
	weeksDir: WEEK_WEEK_DIR
}
