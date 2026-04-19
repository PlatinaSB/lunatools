<script>
	import * as Card from '$lib/components/ui/card/index.js';
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
				<Card.Description>pick here</Card.Description>
			</Card.Header>
			<Card.Content></Card.Content>
		</Card.Root>
	</div>
</main>
