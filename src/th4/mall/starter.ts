(() => {
    try {
        const modules = import.meta.glob('./**/*.ts', {eager: true});
        const count = Object.keys(modules).length;
        console.info(`商城购物车框架自动扫描完成，加载模块数: ${count}`);
    } catch (err) {
        console.error("自动扫描失败", err);
    }
})()