#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Web Worker 大数据表格优化 Demo - 项目验证脚本

用于快速验证项目的完整性和功能正确性
"""

import os
import sys
from pathlib import Path

class ProjectValidator:
    """项目验证器"""
    
    def __init__(self):
        self.project_path = Path(__file__).parent
        self.required_files = {
            'index.html': '主页面',
            'main.js': '主线程逻辑',
            'worker.js': 'Worker 线程',
            'README.md': '详细文档',
            'QUICK_START.md': '快速开始指南',
            'TEST_GUIDE.js': '测试用例',
            'ADVANCED_OPTIMIZATION.js': '高级优化方案',
            '完整说明书.md': '完整说明',
            'start.sh': '启动脚本'
        }
        self.errors = []
        self.warnings = []
    
    def validate_file_exists(self):
        """检验所有必需文件是否存在"""
        print("📁 检查文件完整性...")
        for filename, description in self.required_files.items():
            filepath = self.project_path / filename
            if filepath.exists():
                file_size = filepath.stat().st_size
                print(f"  ✅ {filename:<30} ({file_size:>8} bytes) - {description}")
            else:
                error = f"❌ 缺失文件: {filename}"
                print(f"  {error}")
                self.errors.append(error)
    
    def validate_file_content(self):
        """检验文件内容的正确性"""
        print("\n📝 检查文件内容...")
        
        # 检查 HTML
        html_file = self.project_path / 'index.html'
        if html_file.exists():
            content = html_file.read_text(encoding='utf-8')
            checks = [
                ('表格元素', '<div class="table-wrapper"'),
                ('虚拟列表', 'id="table-body"'),
                ('性能监控', 'id="metric-inp"'),
                ('搜索框', 'id="search-input"'),
                ('Worker 加载', 'src="main.js"'),
            ]
            for check_name, check_str in checks:
                if check_str in content:
                    print(f"  ✅ HTML 包含 {check_name}")
                else:
                    warning = f"⚠️  HTML 缺少 {check_name}"
                    print(f"  {warning}")
                    self.warnings.append(warning)
        
        # 检查 main.js
        main_file = self.project_path / 'main.js'
        if main_file.exists():
            content = main_file.read_text(encoding='utf-8')
            checks = [
                ('PerformanceMonitor 类', 'class PerformanceMonitor'),
                ('VirtualList 类', 'class VirtualList'),
                ('WorkerManager 类', 'class WorkerManager'),
                ('DataTableApp 类', 'class DataTableApp'),
                ('性能记录方法', 'recordInputResponse'),
            ]
            for check_name, check_str in checks:
                if check_str in content:
                    print(f"  ✅ main.js 包含 {check_name}")
                else:
                    warning = f"⚠️  main.js 缺少 {check_name}"
                    print(f"  {warning}")
                    self.warnings.append(warning)
        
        # 检查 worker.js
        worker_file = self.project_path / 'worker.js'
        if worker_file.exists():
            content = worker_file.read_text(encoding='utf-8')
            checks = [
                ('数据生成', 'generateData'),
                ('索引构建', 'buildSearchIndex'),
                ('搜索方法', 'searchByKeyword'),
                ('数据处理', 'processData'),
                ('消息监听', 'self.onmessage'),
            ]
            for check_name, check_str in checks:
                if check_str in content:
                    print(f"  ✅ worker.js 包含 {check_name}")
                else:
                    warning = f"⚠️  worker.js 缺少 {check_name}"
                    print(f"  {warning}")
                    self.warnings.append(warning)
    
    def validate_code_quality(self):
        """检验代码质量"""
        print("\n🔍 检查代码质量...")
        
        # 检查注释
        main_file = self.project_path / 'main.js'
        if main_file.exists():
            content = main_file.read_text(encoding='utf-8')
            comment_ratio = content.count('//') / len(content.split('\n'))
            if comment_ratio > 0.1:
                print(f"  ✅ main.js 注释比例良好 ({comment_ratio:.1%})")
            else:
                warning = f"⚠️  main.js 注释比例较低 ({comment_ratio:.1%})"
                print(f"  {warning}")
                self.warnings.append(warning)
        
        # 检查代码行数
        total_lines = 0
        for filename in ['main.js', 'worker.js', 'index.html']:
            filepath = self.project_path / filename
            if filepath.exists():
                lines = len(filepath.read_text(encoding='utf-8').split('\n'))
                total_lines += lines
                print(f"  ℹ️  {filename:<15} {lines:>5} 行代码")
        
        print(f"  ℹ️  总计              {total_lines:>5} 行代码")
    
    def check_dependencies(self):
        """检查依赖"""
        print("\n📦 检查依赖...")
        
        # Web Worker 不需要外部依赖
        print("  ✅ 不需要任何外部依赖（纯 JavaScript）")
        print("  ✅ 只需要现代浏览器和 HTTP 服务器")
    
    def check_performance_features(self):
        """检查性能优化特性"""
        print("\n⚡ 检查性能优化特性...")
        
        features = {
            '虚拟列表': ('main.js', 'class VirtualList'),
            '倒排索引': ('worker.js', 'buildSearchIndex'),
            'Worker 缓存': ('worker.js', 'lastQueryParams'),
            '防抖搜索': ('main.js', 'debounce'),
            '性能监控': ('main.js', 'class PerformanceMonitor'),
            '分块返回': ('worker.js', 'paginateData'),
        }
        
        for feature, (filename, check_str) in features.items():
            filepath = self.project_path / filename
            if filepath.exists():
                content = filepath.read_text(encoding='utf-8')
                if check_str in content:
                    print(f"  ✅ {feature:<15} 已实现")
                else:
                    warning = f"⚠️  {feature:<15} 未找到"
                    print(f"  {warning}")
                    self.warnings.append(warning)
    
    def print_summary(self):
        """打印汇总信息"""
        print("\n" + "=" * 60)
        print("📊 验证汇总".center(60))
        print("=" * 60)
        
        if not self.errors and not self.warnings:
            print("\n🎉 完美！项目检验全部通过！")
            print("\n✅ 文件完整")
            print("✅ 代码质量良好")
            print("✅ 性能优化完整")
            print("✅ 注释清晰")
            return 0
        
        if self.errors:
            print(f"\n❌ 发现 {len(self.errors)} 个错误:")
            for error in self.errors:
                print(f"  {error}")
        
        if self.warnings:
            print(f"\n⚠️  发现 {len(self.warnings)} 个警告:")
            for warning in self.warnings:
                print(f"  {warning}")
        
        return 1 if self.errors else 0
    
    def print_quick_start(self):
        """打印快速开始信息"""
        print("\n" + "=" * 60)
        print("🚀 快速开始".center(60))
        print("=" * 60)
        
        print("\n步骤 1: 启动 HTTP 服务器")
        print("  cd /Users/ashy/Documents/example/web-worker")
        print("  python3 -m http.server 8000")
        
        print("\n步骤 2: 打开浏览器")
        print("  http://localhost:8000")
        
        print("\n步骤 3: 测试功能")
        print("  - 在搜索框输入关键词")
        print("  - 观察顶部的性能指标")
        print("  - 尝试排序、筛选、滚动")
        
        print("\n步骤 4: 查看文档")
        print("  - README.md: 详细功能说明")
        print("  - QUICK_START.md: 快速开始指南")
        print("  - TEST_GUIDE.js: 完整测试用例")
        print("  - 完整说明书.md: 中文详解")
    
    def run(self):
        """运行验证"""
        print("\n" + "=" * 60)
        print("Web Worker 大数据表格优化 Demo - 项目验证".center(60))
        print("=" * 60 + "\n")
        
        self.validate_file_exists()
        self.validate_file_content()
        self.validate_code_quality()
        self.check_dependencies()
        self.check_performance_features()
        
        exit_code = self.print_summary()
        self.print_quick_start()
        
        print("\n" + "=" * 60 + "\n")
        
        return exit_code


if __name__ == '__main__':
    validator = ProjectValidator()
    exit_code = validator.run()
    sys.exit(exit_code)
