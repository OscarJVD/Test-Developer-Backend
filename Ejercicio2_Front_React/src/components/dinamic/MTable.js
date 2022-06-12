import MaterialTable from 'material-table'
import esLocale from 'date-fns/locale/es'
import { useState } from 'react'

const MTable = ({ title, data, columns,
    // actions = [], actionsColIndex = 0,
    grouping = true, detailPanel
}) => {

    // console.log('TABLE DATA AND COLUMNS');
    // console.log(data);
    // console.log(columns);
    // console.log('END TABLE DATA AND COLUMNS');

    return (
        <MaterialTable
            // parentChildData={(row, rows) => rows.find(a => a._id === row.user)}
            size={'small'}
            title={title}
            data={data}
            columns={columns}
            // actions={actions}
            options={{
                // defaultGroupSort: 'desc',
                // defaultSort: 'desc',
                // selection: true,
                // actionsColumnIndex: parseInt(actionsColIndex),
                search: true,
                paging: true,
                filtering: true,
                // exportButton: true,
                // columnsButton: true,
                // detailPanelType: 'multiple',
                // draggable: true,
                exportAllData: true,
                sorting: true,
                columnResizable: true,
                // showTextRowsSelected: true,
                tableLayout: 'auto',
                padding: 'dense',
                grouping: grouping,
                pageSize: 10,
                // cspNonce: 'sdkjfhsdkfh'
            }}
            detailPanel={detailPanel}
            localization={{
                body: {
                    dateTimePickerLocalization: esLocale,
                    emptyDataSourceMessage: "No hay registros para mostrar",
                    // addTooltip: 'Añadir',
                    // deleteTooltip: 'Eliminar',
                    // editTooltip: 'Editar',
                    filterRow: {
                        filterTooltip: 'Filtrar'
                    },
                    // editRow: {
                    //     deleteText: '¿Quiere eliminar esta línea?',
                    //     cancelTooltip: 'Anular',
                    //     saveTooltip: 'Registro'
                    // }
                },
                grouping: {
                    placeholder: "Arrastra los encabezados aquí para agruparlos",
                    groupedBy: 'Agrupado por:'
                },
                header: {
                    actions: 'Acciones'
                },
                pagination: {
                    labelDisplayedRows: '{from}-{to} de {count}',
                    labelRowsSelect: 'filas',
                    labelRowsPerPage: 'filas por página:',
                    firstAriaLabel: 'Primer página',
                    firstTooltip: 'Primer página',
                    previousAriaLabel: 'página anterior',
                    previousTooltip: 'página anterior',
                    nextAriaLabel: 'página siguiente',
                    nextTooltip: 'página siguiente',
                    lastAriaLabel: 'Última página',
                    lastTooltip: 'Última página'
                },
                toolbar: {
                    // addRemoveColumns: 'Añadir o Eliminar columnas',
                    // // nRowsSelected: '{0} fila(s) seleccionada(s)',
                    // showColumnsTitle: 'Ver las columnas',
                    // showColumnsAriaLabel: 'Ver las columnas',
                    exportTitle: 'Exportar',
                    exportAriaLabel: 'Exportar',
                    exportName: 'Exportar como CSV',
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                }
            }}

        />
    );
}

// actions={
//     {
//         icon: 'edit',
//         tooltip: 'Editar',
//         render: rowData => <h2>TEST</h2>
//     }
// }

export default MTable;
