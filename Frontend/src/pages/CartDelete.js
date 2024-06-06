import React from 'react';
import { Button, message, Popconfirm } from 'antd';
const confirm = (e) => {
  console.log(e);
  message.success('Product Removed Successfully');
};
const cancel = (e) => {
  console.log(e);
};
const CartDelete = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this Product?"
    onConfirm={confirm}
    onCancel={cancel}
    okText="Yes"
    cancelText="No"
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);
export default CartDelete;