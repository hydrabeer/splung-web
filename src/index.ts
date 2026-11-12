/*
 * splung.ca, the home of splung city on the web
 * Copyright (C) 2026 splung.ca contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

function page(message: string, nonce: string): string {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
		<title>splung city</title>
		<meta name="description" content="GOOD MORNING SPLUNG CITY!">
		<meta name="theme-color" content="#071014" />
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://splung.ca">
		<meta property="og:title" content="Splung">
		<meta property="og:description" content="splung city">
		<meta property="og:image" content="https://splung.ca/splung.gif">
		<meta property="og:image:type" content="image/gif">
		<meta name="twitter:card" content="summary_large_image">
		<link rel="preload" href="/fonts/inter-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
		<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="shortcut icon" href="/favicon.ico" />
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
		<meta name="apple-mobile-web-app-title" content="splung" />
		<link rel="manifest" href="/site.webmanifest" />
		<style nonce="${nonce}">
			@font-face {
				font-family: Inter;
				font-weight: 700;
				font-style: normal;
				font-display: swap;
				src: url(/fonts/inter-latin-700-normal.woff2) format("woff2");
			}
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

			img, video {
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
			<video autoplay loop muted playsinline width="314" height="314" poster="/splung-poster.webp" aria-label="splung grown">
				<source src="/splung.webm" type="video/webm">
				<source src="/splung.mp4" type="video/mp4">
			</video>
			<h1 id="greeting">${message}</h1>
		</main>
		<script nonce="${nonce}">
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

function makeNonce(): string {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        return btoa(String.fromCharCode(...bytes));
}

function securityHeaders(nonce: string, extra: Record<string, string> = {}): Headers {
        const csp = [
                "default-src 'none'",
                "base-uri 'self'",
                "object-src 'none'",
                "frame-ancestors 'none'",
                "form-action 'self'",
                "upgrade-insecure-requests",
                "img-src 'self' data:",
                "media-src 'self'",
                "manifest-src 'self'",
                "font-src 'self'",
                `style-src 'self' 'nonce-${nonce}'`,
                `script-src 'self' 'nonce-${nonce}'`,
                "connect-src 'self'",
                "require-trusted-types-for 'script'",
                "trusted-types 'none'",
        ].join("; ");

        return new Headers({
                "Content-Security-Policy": csp,
                "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
                "Cross-Origin-Opener-Policy": "same-origin",
                "X-Frame-Options": "DENY",
                "Referrer-Policy": "no-referrer",
                "X-Content-Type-Options": "nosniff",
                "Cross-Origin-Resource-Policy": "same-origin",
                ...extra,
        });
}

export default {
	async fetch(request): Promise<Response> {
		const url = new URL(request.url);
		const nonce = makeNonce();

		if (url.pathname !== "/" && url.pathname !== "") {
			return new Response("not found", {
				status: 404,
				headers: securityHeaders(nonce),
			});
		}

		return new Response(page(greeting(calgaryHour()), nonce), {
			headers: securityHeaders(nonce, {
				"content-type": "text/html; charset=utf-8",
				"cache-control": "public, max-age=60",
			}),
		});
	},
} satisfies ExportedHandler<Env>;
