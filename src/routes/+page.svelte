<script>
	import * as Card from '$lib/components/ui/card/index.js';

	const imageTools = [
		{
			title: 'Convert Image',
			href: '/convert',
			description: 'Convert images between formats'
		},
		{
			title: 'Compress Image',
			href: '/compress',
			description: 'Reduce image file size'
		}
	];

	const cardTools = [
		{
			title: '24 Card Game',
			href: '/24cardgame',
			description: 'solve 24 card puzzles'
		}
	];
</script>

<svelte:head>
	<title>Luna Tools</title>
	<meta name="description" content="i make random stuff that work on browser to put here" />
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-2xl space-y-6 text-center">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Luna Tools</h1>
			<p class="text-muted-foreground">i make random stuff that work on browser to put here</p>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>My Tools</Card.Title>
			</Card.Header>

			<Card.Content class="space-y-6">
				<div class="space-y-2">
					<h2 class="text-lg font-semibold">Image Tools</h2>
					<div class="grid gap-2">
						{#each imageTools as tool}
							<a
								href={tool.href}
								class="block rounded-md border p-3 text-left hover:bg-muted transition"
							>
								<div class="font-medium">{tool.title}</div>
								<div class="text-sm text-muted-foreground">{tool.description}</div>
							</a>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<h2 class="text-lg font-semibold">Playing Card</h2>
					<div class="grid gap-2">
						{#each cardTools as tool}
							<a
								href={tool.href}
								class="block rounded-md border p-3 text-left hover:bg-muted transition"
							>
								<div class="font-medium">{tool.title}</div>
								<div class="text-sm text-muted-foreground">{tool.description}</div>
							</a>
						{/each}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</main>