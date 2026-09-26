import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}'], theme: { extend: { colors: { ink:'#19241f', moss:'#315c48', cream:'#f5f6ef', line:'#dce3da', coral:'#e58b62', gold:'#e9b949' }, fontFamily:{sans:['var(--font-inter)']} } }, plugins: [] } satisfies Config;
