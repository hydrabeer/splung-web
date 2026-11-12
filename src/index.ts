const CALGARY_TZ = "America/Edmonton";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function calgaryHour(date = new Date()): number {
	const hourPart = new Intl.DateTimeFormat("en-CA", {
		timeZone: CALGARY_TZ,
		hour: "numeric",
		hourCycle: "h23",
	})
		.formatToParts(date)
		.find((part) => part.type === "hour")?.value;

	return Number.parseInt(hourPart ?? "0", 10);
}

function timeOfDay(hour: number): TimeOfDay {
	if (hour >= 5 && hour < 12) return "morning";
	if (hour >= 12 && hour < 17) return "afternoon";
	if (hour >= 17 && hour < 21) return "evening";
	return "night";
}

function greeting(hour: number): string {
	return `good ${timeOfDay(hour)} splung city`;
}

function page(message: string): string {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
		<title>splung city</title>
		<meta name="theme-color" content="#071014" />
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://splung.ca">
		<meta property="og:title" content="Splung">
		<meta property="og:description" content="Your description here">
		<meta property="og:image" content="https://splung.ca/splung.gif">
		<meta property="og:image:type" content="image/gif">
		<meta name="twitter:card" content="summary_large_image">
		<meta name="theme-color" content="#5865F2">
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap" rel="stylesheet" />
		<style>
			:root {
				color-scheme: dark;
				--bg: #071014;
				--fg: #f4f1ea;
				--pad: max(1.25rem, env(safe-area-inset-top)) max(1.25rem, env(safe-area-inset-right))
					max(1.5rem, env(safe-area-inset-bottom)) max(1.25rem, env(safe-area-inset-left));
			}

			* {
				box-sizing: border-box;
				margin: 0;
			}

			html,
			body {
				min-height: 100%;
				min-height: 100dvh;
			}

			body {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: var(--pad);
				background: var(--bg);
				color: var(--fg);
				font-family: Inter, system-ui, sans-serif;
				font-weight: 500;
				text-transform: lowercase;
				-webkit-font-smoothing: antialiased;
			}

			main {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: clamp(1rem, 4vw, 1.75rem);
				width: min(100%, 42rem);
			}

			img {
				display: block;
				width: 100%;
				height: auto;
				max-height: min(68dvh, 36rem);
				object-fit: contain;
				border-radius: 0.75rem;
			}

			h1 {
				max-width: 18ch;
				font-size: clamp(1.5rem, 7.5vw, 2.75rem);
				font-weight: 700;
				letter-spacing: -0.04em;
				line-height: 1.15;
				text-align: center;
				text-wrap: balance;
			}
		</style>
	</head>
	<body>
		<main>
			<img src="/splung.gif" alt="splung grown" />
			<h1 id="greeting">${message}</h1>
		</main>
		<script>
			const TZ = ${JSON.stringify(CALGARY_TZ)};

			function calgaryHour() {
				const hourPart = new Intl.DateTimeFormat("en-CA", {
					timeZone: TZ,
					hour: "numeric",
					hourCycle: "h23",
				})
					.formatToParts(new Date())
					.find((part) => part.type === "hour")?.value;
				return Number.parseInt(hourPart ?? "0", 10);
			}

			function greeting(hour) {
				let part = "night";
				if (hour >= 5 && hour < 12) part = "morning";
				else if (hour >= 12 && hour < 17) part = "afternoon";
				else if (hour >= 17 && hour < 21) part = "evening";
				return "good " + part + " splung city";
			}

			const el = document.getElementById("greeting");
			function paint() {
				el.textContent = greeting(calgaryHour());
			}
			paint();
			setInterval(paint, 30_000);
		</script>
	</body>
</html>`;
}

export default {
	async fetch(request): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== "/" && url.pathname !== "") {
			return new Response("not found", { status: 404 });
		}

		return new Response(page(greeting(calgaryHour())), {
			headers: {
				"content-type": "text/html; charset=utf-8",
				"cache-control": "public, max-age=60",
			},
		});
	},
} satisfies ExportedHandler<Env>;
