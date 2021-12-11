export default {
    data() {
        return {
            pagination: {
                pageSizeOptions: ['25', '50', '100'],
                total: 0,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSize: 25,
                defaultPageSize: 25,
                current: 1,
                showTotal: (total) => {
                    let pageNum = Math.ceil(total / this.pagination.pageSize)
                    return '共 ' + pageNum + ' 页' + ' ' + total + ' 条数据'
                }
            }
        }
    },
    methods: {
        onPageChange(e) {
            this.pagination.current = e.current
            this.pagination.pageSize = e.pageSize
            if (this.load !== undefined) {
                this.load()
            }
        }
    }
}
