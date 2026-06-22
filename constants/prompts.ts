export const WRITING_PROMPTS = [
	"¿Qué fue lo más importante que pasó hoy?",
	"¿Algo que te haya hecho sonreír hoy?",
	"¿Qué aprendiste hoy?",
	"¿Cómo te sentiste al despertar esta mañana?",
	"¿Hay algo que te gustaría haber hecho diferente hoy?",
	"¿Qué momento del día disfrutaste más?",
	"¿Qué está ocupando tu mente en este momento?",
	"¿Algo que esperes con ansias mañana?",
	"¿Qué fue lo más difícil de hoy?",
	"¿A quién agradeces hoy?",
	"¿Qué canción describe mejor tu día de hoy?",
	"¿Tuviste alguna conversación interesante hoy?",
	"¿Qué hiciste hoy que no hayas hecho antes?",
	"¿Cómo describirías tu nivel de energía hoy?",
	"¿Hay algo que quieras dejar ir de hoy?",
	"¿Qué te gusta de la persona en la que te estás convirtiendo?",
	"¿Cuál fue el momento de mayor paz hoy?",
	"¿Qué te gustaría recordar de este día en 10 años?",
	"¿Hay algo que no dijiste hoy y te hubiera gustado decir?",
	"¿Qué fue lo más gracioso que pasó hoy?",
	"¿Cómo cuidaste de ti mismo hoy?",
	"¿Qué diste y qué recibiste hoy?",
	"¿Hubo algún momento de conexión genuina hoy?",
	"¿Qué te gustaría que mañana sea diferente?",
	"¿Cuál fue tu pensamiento más recurrente hoy?",
];

export function getDailyPrompt(date: Date): string {
	const seed =
		date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
	return WRITING_PROMPTS[seed % WRITING_PROMPTS.length]!;
}
