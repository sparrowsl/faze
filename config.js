import * as v from "valibot";
import "dotenv/config";

const config_schema = v.object({
	BOT_TOKEN: v.pipe(v.string(), v.nonEmpty("BOT_TOKEN must not be empty")),
	CHANNELS: v.pipe(
		v.optional(v.string(), ""),
		v.transform((input) => {
			if (input.trim() === "") {
				return [];
			}

			return input.split(",").map((val) => val.trim());
		}),
	),
	BEARER_TOKEN: v.pipe(
		v.string(),
		v.nonEmpty("BEARER_TOKEN must not be empty"),
	),
	BASE_ID: v.pipe(v.string(), v.nonEmpty("BASE_ID must not be empty")),
	TABLE_ID: v.pipe(v.string(), v.nonEmpty("TABLE_ID must not be empty")),
});

function validate() {
	const { success, output, issues } = v.safeParse(config_schema, process.env, {
		abortEarly: true,
	});

	if (!success) {
		console.log(issues.at(0).message);
		process.exit(1);
	}

	return output;
}

export const config = validate();
