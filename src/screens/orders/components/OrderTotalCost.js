import React from 'react';
import {Box, Text} from '@atoms';
import {StyleSheet} from 'react-native';
import {calculatePrice} from '../../../utils/CommonFunctions';

const OrdertotalCost = ({orderDetail, orderShipment, orderId}) => {
  const tax = orderDetail?.totals?.taxTotal;

  return (
    <Box>
      {/* <Text style={styles.horizontalLine} /> */}
      {/* <Box flexDirection="row" justifyContent="space-between">
        <Text>Grand Total</Text>
        <Text>${orderDetail?.totals?.grandTotal}</Text>
      </Box> */}
      <Text style={styles.horizontalLine} />
      {/* <Text variant="bold18">Order Details</Text>
      <Text style={styles.horizontalLine} />
      <Text style={styles.headerText}>Order Id</Text>
      <Text style={styles.subHeaderText}>{orderId}</Text>
      <Text style={styles.orderInfoText}>Payment</Text>
      <Text style={styles.orderInfoText}>
        Paid : Using {orderDetail?.payments?.[0]?.paymentMethod}
      </Text>
      <Text style={styles.orderInfoText}>Date</Text>
      <Text style={styles.orderInfoText}>
        {orderShipment?.[0]?.attributes?.requestedDeliveryDate}
      </Text>
      <Text style={styles.orderInfoText}>Phone number</Text>
      <Text style={styles.orderInfoText}>
        {orderShipment?.[0]?.attributes?.shippingAddress?.phone}
      </Text>
      <Text lightText>Deliver to</Text>
      <Text style={styles.orderInfoText}>
        {orderShipment?.[0]?.attributes?.shippingAddress?.address1}
      </Text>
      <Text style={styles.horizontalLine} /> */}
      <Text
        mt="s16"
        //  style={styles.headerText}
        variant="bold18">
        Billing Address
      </Text>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Address</Text>
        <Text>{orderDetail?.billingAddress?.address1}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>City</Text>
        <Text>{orderDetail?.billingAddress?.city}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Country</Text>
        <Text>{orderDetail?.billingAddress?.country}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Iso2Code</Text>
        <Text>{orderDetail?.billingAddress?.iso2Code}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Zip Code</Text>
        <Text>{orderDetail?.billingAddress?.zipCode}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Salutation</Text>
        <Text>{orderDetail?.billingAddress?.salutation}</Text>
      </Box>
      <Text style={styles.horizontalLine} />

      <Text
        mt="s12"
        // style={styles.headerText}
        variant="bold18">
        Payment Details
      </Text>

      <Box mt="s16" flexDirection="row" justifyContent="space-between">
        <Text
          // style={{fontWeight: 'bold'}}
          variant="bold18">
          Item Total
        </Text>
        <Text
          // style={{fontWeight: 'bold'}}
          variant="bold18">
          ${calculatePrice(orderDetail?.totals?.subtotal)}
        </Text>
      </Box>

      <Box mt="s6" flexDirection="row" justifyContent="space-between">
        <Text>Payment By</Text>
        <Text>{orderDetail?.payments?.[0]?.paymentMethod}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Delivery Charge</Text>
        <Text>${calculatePrice(orderDetail?.totals?.expenseTotal)}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Tax Included</Text>
        <Text>${calculatePrice(tax)}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Discount Total</Text>
        <Text>${calculatePrice(orderDetail?.totals?.discountTotal)}</Text>
      </Box>
      <Box mt="s6" mb="s10" flexDirection="row" justifyContent="space-between">
        <Text>Item status : {orderDetail?.itemStates}</Text>
        <Text
          // fontWeight="bold"
          variant="bold18">
          Total Amount : ${calculatePrice(orderDetail?.totals?.grandTotal)}{' '}
        </Text>
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },

  headerText: {
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'green',
  },
  orderInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
export default OrdertotalCost;
