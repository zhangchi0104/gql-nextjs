import { DetailedHTMLProps, FormHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormField } from "./form-field";
import FormLabel from "./form-label";
import { cn } from "~/lib/utils";

const LocalityForm = ({
  className,
  ...props
}: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) => {
  return (
    <form
      data-testid="locality-form__form"
      className={cn("space-y-4", className)}
      {...props}
    >
      <FormField data-testid="locality-form__suburb">
        <FormLabel htmlFor="locality-form__suburb">Suburb</FormLabel>
        <Input
          placeholder="Sydney"
          id="locality-form__suburb"
          name="suburb"
          type="text"
        />
      </FormField>
      <div className="flex  flex-row gap-8">
        <FormField className="flex-1" data-testid="locality-form__postcode">
          <FormLabel htmlFor="locality-form__postcode">Postcode</FormLabel>
          <Input
            placeholder="2000"
            id="locality-form__postcode"
            name="postcode"
            type="number"
          />
        </FormField>
        <FormField className="flex-1" data-testid="locality-form__state">
          <FormLabel htmlFor="locality-form__state">State</FormLabel>
          <Select name="state">
            <SelectTrigger id="locality-form__state">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NSW">NSW</SelectItem>
              <SelectItem value="VIC">VIC</SelectItem>
              <SelectItem value="QLD">QLD</SelectItem>
              <SelectItem value="SA">SA</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField data-testid="locality-form__submit">
        <Button type="submit" className="w-full mt-4">
          Validate Now
        </Button>
      </FormField>
    </form>
  );
};

export default LocalityForm;
