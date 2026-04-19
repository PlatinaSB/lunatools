<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

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
			<NavigationMenu.Trigger>imageTools</NavigationMenu.Trigger>
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

		<NavigationMenu.Item class="hidden md:block">
			<NavigationMenu.Trigger>List</NavigationMenu.Trigger>
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
	</NavigationMenu.List>
</NavigationMenu.Root>

{@render children()}
