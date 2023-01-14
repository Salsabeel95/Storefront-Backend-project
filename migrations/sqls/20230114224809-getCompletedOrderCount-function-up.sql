create or replace function getOrderCountInLastDays(days int)
RETURNS integer LANGUAGE plpgsql AS $body$
begin
RETURN (select count(id) from orders
          where status='delivered' 
			and order_date::date >=current_date-days);
END
$body$;