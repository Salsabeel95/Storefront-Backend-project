CREATE OR REPLACE FUNCTION default_category_enum_value()
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS
$$
BEGIN
    IF(NEW.category Is NULL) THEN
        UPDATE products 
        SET category=DEFAULT
        WHERE id= NEW.id;
    END IF;
RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_default_category_enum_value after insert or update 
ON products 
FOR EACH ROW
EXECUTE PROCEDURE default_category_enum_value();
 