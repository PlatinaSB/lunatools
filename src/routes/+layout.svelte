<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logo.png';
	import { ModeWatcher } from 'mode-watcher';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toggleMode } from 'mode-watcher';
	import { Moon as MoonIcon } from 'lucide-svelte';
	import { Sun as SunIcon } from 'lucide-svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';

	let { children } = $props();

	const isMobile = new IsMobile();

	const imageTools: { title: string; href: string; description: string }[] = [
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

	const cardTools: { title: string; href: string; description: string }[] = [
		{
			title: '24 Card Game',
			href: '/24cardgame',
			description: 'solve 24 card puzzles'
		}
	];

	const aiTools: { title: string; href: string; description: string }[] = [
		{
			title: 'IndoBERT AI Text Classification',
			href: '/indobert-ai-text-classification',
			description: 'Adalah alat deteksi teks generatif AI berbahasa Indonesia'
		}
	];

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

{#snippet ListItem({ title, content, href, class: className, ...restProps }: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					rel=""
					class={cn(
						'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...restProps}
				>
					<div class="text-sm leading-none font-medium">{title}</div>
					<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<NavigationMenu.Root viewport={isMobile.current}>
	<NavigationMenu.List class="flex-wrap">
		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/" class={navigationMenuTriggerStyle()}>Home</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>AI Tools</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-[300px] gap-4 p-2">
					{#each aiTools as cardTool, i (i)}
						{@render ListItem({
							href: cardTool.href,
							title: cardTool.title,
							content: cardTool.description
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Image Tools</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-[300px] gap-2 p-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
					{#each imageTools as imageTool, i (i)}
						{@render ListItem({
							href: imageTool.href,
							title: imageTool.title,
							content: imageTool.description
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Playing Card</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-[300px] gap-4 p-2">
					{#each cardTools as cardTool, i (i)}
						{@render ListItem({
							href: cardTool.href,
							title: cardTool.title,
							content: cardTool.description
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

{@render children()}
