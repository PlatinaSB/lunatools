<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { File as FileIcon, X as Xicon } from 'lucide-svelte';
	import Compressor from 'compressorjs';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onDestroy } from 'svelte';
	import * as NativeSelect from '$lib/components/ui/native-select/index.js';

	let file1: FileList | undefined = $state(undefined);
	let results: { url: string; name: string }[] = $state([]);
	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null | undefined = $state(null);

	let format: 'jpeg' | 'png' | 'webp' = $state('jpeg');
	let useCompression = $state(false);
	let quality = $state(0.8);

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
		fileInput?.click();
	}

	function getName(file: File) {
		const base = file.name.replace(/\.[^/.]+$/, '');
		return `${base}.${format}`;
	}

	function removeFile(index: number) {
		if (!file1) return;

		const dt = new DataTransfer();
		Array.from(file1).forEach((file, i) => {
			if (i !== index) dt.items.add(file);
		});

		file1 = dt.files;
		if (fileInput) fileInput.files = dt.files;
	}

	function clearFiles() {
		file1 = undefined;
		results.forEach((r) => URL.revokeObjectURL(r.url));
		results = [];
		if (fileInput) fileInput.value = '';
	}

	async function processImages() {
		if (!file1) return;

		results.forEach((r) => URL.revokeObjectURL(r.url));
		results = [];

		const files = Array.from(file1);

		const processed = await Promise.all(
			files.map(
				(file) =>
					new Promise<{ url: string; name: string }>((resolve, reject) => {
						new Compressor(file, {
							quality: useCompression ? quality : 1,
							mimeType: `image/${format}`,
							success(result) {
								const url = URL.createObjectURL(result as Blob);
								resolve({
									url,
									name: getName(file)
								});
							},
							error(err) {
								reject(err);
							}
						});
					})
			)
		);

		results = processed;
	}

	onDestroy(() => {
		results.forEach((r) => URL.revokeObjectURL(r.url));
	});
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
								bind:ref={fileInput}
								bind:files={file1}
							/>
							<Button onclick={triggerFile}>Upload</Button>
						</Empty.Content>
					</Empty.Root>
				</div>
			{:else}
				<div class="grid grid-cols-3 gap-3">
					{#each Array.from(file1) as file, i}
						<div class="relative">
							<img src={URL.createObjectURL(file)} class="rounded-xl" alt={file.name} />
							<Button
								class="absolute top-1 right-1"
								variant="destructive"
								onclick={() => removeFile(i)}
							>
								<Xicon />
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			{#if file1 && file1.length > 0}
				<div class="mt-4 space-y-3">
					<div class="flex items-center gap-3">
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

						<Button variant="destructive" onclick={clearFiles}>Clear All</Button>
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
