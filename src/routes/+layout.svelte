<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.ts';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children } = $props();
	const isMobile = new IsMobile();

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content?: string;
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
					{#if content}
						<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{content}
						</p>
					{/if}
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<NavigationMenu.Root viewport={isMobile.current}>
	<NavigationMenu.List class="flex-wrap">
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Image Tools</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-[300px] gap-2 p-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
					{@render ListItem({
						href: '/convert',
						title: 'Convert Image',
						content: 'Convert images between formats'
					})}
					{@render ListItem({
						href: '/compress',
						title: 'Compress Image',
						content: 'Reduce image file size'
					})}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Playing Card Tools</NavigationMenu.Trigger>
			<NavigationMenu.Content class="z-50">
				<ul class="grid w-[300px] gap-4 p-2">
					{@render ListItem({
						href: '/24cardgame',
						title: '24 Card Game',
						content: 'solve 24 card puzzles'
					})}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>

	<NavigationMenu.Viewport />
</NavigationMenu.Root>

{@render children()}
