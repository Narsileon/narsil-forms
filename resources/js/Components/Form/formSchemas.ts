import { LanguageModel } from "@narsil-localization/Types";
import { z, ZodOptional, ZodString } from "zod";

export const transSchema = (languages: LanguageModel[]) => {
	return z.object({
		id: z.number().optional(),
		values: z.object(
			languages.reduce(
				(acc, language) => {
					acc[language.locale] = z.string().optional();
					return acc;
				},
				{} as Record<string, ZodOptional<ZodString>>
			)
		),
	});
};
