describe("import vue components", () => {
	test('normal imports as expected', async () => {
		const component = await import("../app.vue");
		expect(component).toBeDefined();
	})
})