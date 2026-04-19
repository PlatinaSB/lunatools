<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { File as FileIcon } from 'lucide-svelte';
	import Compressor from 'compressorjs';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';

	let file1: FileList | null = $state(null);
	let results: { url: string; name: string }[] = $state([]);
	let isDragging: boolean = $state(false);

	let format: 'jpeg' | 'png' | 'webp' = $state('jpeg');
	let useCompression: boolean = $state(false);
	let quality: number = $state(0.8);

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		file1 = target.files;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			file1 = e.dataTransfer.files;
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function triggerFile() {
		document.getElementById('file')?.click();
	}

	function getName(file: File) {
		const base = file.name.replace(/\.[^/.]+$/, '');
		return `${base}.${format}`;
	}

	function processImages() {
		if (!file1) return;

		results = [];

		Array.from(file1).forEach((file) => {
			new Compressor(file, {
				quality: useCompression ? quality : 1,
				mimeType: `image/${format}`,
				success(result) {
					const url = URL.createObjectURL(result as Blob);
					const name = getName(file);

					results = [...results, { url, name }];
				},
				error(err) {
					console.error(err);
				}
			});
		});
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card.Root class="w-full max-w-[66vw]">
		<Card.Header>
			<Card.Title>Convert & Compress Image</Card.Title>
		</Card.Header>

		<Card.Content>
			{#if !file1 || file1.length === 0}
				<div
					role="button"
					tabindex="0"
					class={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center ${
						isDragging ? 'border-blue-500 bg-blue-50' : ''
					}`}
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					onclick={triggerFile}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') triggerFile();
					}}
				>
					<Empty.Root>
						<Empty.Header>
							<Empty.Media variant="icon">
								<FileIcon />
							</Empty.Media>
							<Empty.Title>No Image Uploaded</Empty.Title>
						</Empty.Header>

						<Empty.Content>
							<p>Drag & Drop or click to upload</p>
							<Input
								id="file"
								type="file"
								accept="image/*"
								multiple
								class="hidden"
								onchange={handleChange}
							/>
							<Button type="button">Upload</Button>
						</Empty.Content>
					</Empty.Root>
				</div>
			{:else}
				<div class="grid grid-cols-3 gap-3">
					{#each Array.from(file1) as file}
						<img src={URL.createObjectURL(file)} class="rounded-xl" alt={file.name} />
					{/each}
				</div>
			{/if}

			{#if file1 && file1.length > 0}
				<div class="mt-4 space-y-3">
					<div class="flex gap-3">
						<NativeSelect.Root bind:value={format}>
							<NativeSelect.Option value="jpeg">JPEG</NativeSelect.Option>
							<NativeSelect.Option value="png">PNG</NativeSelect.Option>
							<NativeSelect.Option value="webp">WEBP</NativeSelect.Option>
						</NativeSelect.Root>

						<label class="flex items-center gap-2">
							<input type="checkbox" bind:checked={useCompression} />
							<span>Compression</span>
						</label>

						{#if useCompression}
							<input type="range" min="0.1" max="1" step="0.1" bind:value={quality} />
							<span>{quality}</span>
						{/if}
					</div>

					<Button onclick={processImages}>Convert</Button>
				</div>
			{/if}
		</Card.Content>

		<Card.Footer>
			{#if results.length > 0}
				<div class="mt-4 space-y-3">
					<p>Result:</p>
					<div class="grid grid-cols-3 gap-3">
						{#each results as img}
							<div>
								<img src={img.url} class="mb-2 rounded-xl" alt={img.name} />
								<a href={img.url} download={img.name}>
									<Button>Download</Button>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>
