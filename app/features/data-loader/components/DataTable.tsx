import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TablePagination,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { usePaginatedData } from '@/common/hooks';

import { Data } from '../models';

const useStyles = makeStyles({
  container: {
    flexGrow: 1,
    overflow: 'auto',
  },
  pagination: {
    flexShrink: 0,
  },
});

const TABLE_PAGE_SIZE = 25;

export const DataTable: React.FC<{ data: Data }> = ({ data }) => {
  const classes = useStyles();
  const { currentData, currentPage, changePage } = usePaginatedData(data.rows, {
    pageSize: TABLE_PAGE_SIZE,
  });

  return (
    <>
      <Box className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {data.attributes.map(({ name }) => (
                <TableCell key={name} align="center">
                  {name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map(row => (
              <TableRow key={row.index}>
                {data.attributes.map(({ name }) => (
                  <TableCell key={name} align="center">
                    {String(row[name])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="footer"
        count={data.rows.length}
        page={currentPage}
        rowsPerPage={TABLE_PAGE_SIZE}
        rowsPerPageOptions={[TABLE_PAGE_SIZE]}
        onChangePage={(_, newPage) => changePage(newPage)}
        className={classes.pagination}
      />
    </>
  );
};
