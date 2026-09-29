<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Tulis konten artikel di sini...' },
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image.configure({ inline: true, allowBase64: true }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none',
    },
  },
});

watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val, false);
    }
  }
);
</script>

<template>
  <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="[
          'px-2 py-1 rounded text-sm font-bold transition-colors',
          editor?.isActive('bold') ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        B
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="[
          'px-2 py-1 rounded text-sm italic transition-colors',
          editor?.isActive('italic') ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        I
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="[
          'px-2 py-1 rounded text-sm font-bold transition-colors',
          editor?.isActive('heading', { level: 2 }) ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="[
          'px-2 py-1 rounded text-sm font-bold transition-colors',
          editor?.isActive('heading', { level: 3 }) ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        H3
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="[
          'px-2 py-1 rounded text-sm transition-colors',
          editor?.isActive('bulletList') ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        • List
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="[
          'px-2 py-1 rounded text-sm transition-colors',
          editor?.isActive('orderedList') ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        1. List
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="[
          'px-2 py-1 rounded text-sm transition-colors',
          editor?.isActive('blockquote') ? 'bg-accent text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        ❝
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().setHardBreak().run()"
        class="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        ↵
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().undo().run()"
        class="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        ↩
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().redo().run()"
        class="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        ↪
      </button>
    </div>

    <!-- Editor Area -->
    <EditorContent :editor="editor" class="bg-white dark:bg-secondary text-gray-900 dark:text-gray-100" />
  </div>
</template>
