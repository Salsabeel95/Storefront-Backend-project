create function getTotalIncomeInLastDays(days int)
RETURNS integer LANGUAGE plpgsql AS $body$
declare total integer ; 
begin
select into total sum(quantity*price)
            from orders o join order_products op 
            on o.id =op.order_id
            join products p on op.product_id=p.id
          where status='delivered' 
			and order_date::date >=current_date-days;
RETURN total;
END
$body$;