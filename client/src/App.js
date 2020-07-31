import './App.css';
import logo from './logo.svg';
import cx from 'clsx';
import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useContainedCardHeaderStyles } from '@mui-treasury/styles/cardHeader/contained';
import { useSoftRiseShadowStyles } from '@mui-treasury/styles/shadow/softRise';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Validate from './utils/Validate';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(({ spacing }) => ({
    card: {
        borderRadius: spacing(0.5),
        transition: '0.3s',
        width: '100%',
        overflow: 'initial',
        background: '#ffffff',
        boxShadow: 'none'
    },
    content: {
        textAlign: 'left'
    },
    overrideHeader: {
        margin: "-40px 20px 0px",
        display: 'inline-block',
        background: 'linear-gradient(to right, rgb(59, 138, 87), #3eb554)',
        width: '92%'
    },
    textCenter: {
        textAlign: 'center',
        marginTop: 10
    },
    dropDown: {
        display: 'flex'
    },
    submitButton: {
        marginTop: 20,
        height: '50px',
        fontWeight: 'bold'
    },
    table: {
        marginTop: 20,
        borderCollapse: 'collapse',
        width: '100%',
        '& th': {
            paddingTop: 12,
            paddingBottom: 12,
            backgroundColor: '#303f9f',
            color: 'white'
        },
        '& td, th': {
            padding: 8,
            border: '1px solid #dddddd',
            textAlign: 'center',
            fontSize: 17,
            height: 22,
            fontWeight: 600
        },
        '& tr:nth-child(even)': {
            backgroundColor: '#f2f2f2'
        },
    },
    wrapper: {
        height: 16,
        position: 'relative'
    },
    linearProgress: {
        height: 10,
        margin: '6px 10px'
    },
}));

function App() {
    const classes = useStyles();
    const cardHeaderStyles = useContainedCardHeaderStyles();
    const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
    const cardHeaderShadowStyles = useFadedShadowStyles();

    const [responseGet, setResponseGet] = useState('');
    const [responsePost, setResponsePost] = useState([]);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [isSending, setIsSending] = useState(false);

    const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(0);
    const subscriptionTypeSelection = [
        {
            id: 1,
            value: 1,
            label: 'DAILY'
        },
        {
            id: 2,
            value: 2,
            label: 'WEEKLY'
        },
        {
            id: 3,
            value: 3,
            label: 'MONTHLY'
        }
    ];

    const minStartDate = new Date();
    const [selectedStartDate, setSelectedStartDate] = useState(null);

    const [minEndDate, setMinEndDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const [maxDate, setMaxDate] = useState(new Date());
    const [isSubscriptionTypeSelected, setIsSubscriptionTypeSelected] = useState(false);

    const [isStartDateSelected, setIsStartDateSelected] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(true);

    const [startDateDayOfLabel, setStartDateDayOfLabel] = useState('');
    const [startDateDayOfValue, setStartDateDayOfValue] = useState('');

    const [endDateDayOfLabel, setEndDateDayOfLabel] = useState('');
    const [endDateDayOfValue, setEndDateDayOfValue] = useState('');

    const [body, setBody] = useState({
        Amount: '',
        SubscriptionType: '',
        StartDate: '',
        EndDate: '',
    });

    const [error, setError] = useState({
        Amount: false,
    });

    useEffect(() => {
        callGetApi()
            .then(response => setResponseGet(response.message))
            .catch(error => console.log(error));
    }, []);

    const callGetApi = async () => {
        const response = await fetch('/api/greetingmessage');
        const responseBody = await response.json();
        if (response.status !== 200) throw Error(responseBody.message);
        return responseBody;
    };

    const checkEmptyData = () => {
        const isEmpty = !Object.values(body).every(x => (x !== null && x !== ''));
        setDisableSubmit(isEmpty);
    }

    const onEndDateOpen = () => {
        let startDate = selectedStartDate.getFullYear() + "-" + (selectedStartDate.getMonth() + 1) + "-" + selectedStartDate.getDate();
        if(selectedSubscriptionType === 1){
            let nextDate = new Date(startDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setMinEndDate(nextDate);
        } else if(selectedSubscriptionType === 2){
            let nextDate = new Date(startDate);
            nextDate.setDate(nextDate.getDate() + 7);
            setMinEndDate(nextDate);
        } else {
            let nextDate = new Date(startDate);
            nextDate.setDate(nextDate.getDate() + 30);
            setMinEndDate(nextDate);
        }
        let nextThreeMonthsDate = new Date(startDate);
        nextThreeMonthsDate.setDate(nextThreeMonthsDate.getDate() + 90);
        setMaxDate(nextThreeMonthsDate);
    }

    const resetOnChange = () => {
        setSelectedStartDate(null);
        setIsStartDateSelected(false);
        setSelectedEndDate(null);
        setStartDateDayOfValue('');
        setEndDateDayOfValue('');
        setBody({
            ...body,
            StartDate: '',
            EndDate: ''
        });
    }

    const handleChangeAmount = (e) => {
        if (Validate.numberOnly(e.target.value)) {
            setError({
                ...error,
                Amount: false
            });
            setDisableSubmit(false);
        } else {
            setError({
                ...error,
                Amount: true
            });
            setDisableSubmit(false);
        }
        setBody({
            ...body,
            Amount: e.target.value
        });
    }

    const handleChangeSubscriptionType = (e) => {
        setSelectedSubscriptionType(e.target.value);
        if(e.target.value > 0){
            setIsSubscriptionTypeSelected(true);
            if(e.target.value === 1 || e.target.value === 2){
                setStartDateDayOfLabel('Day of week (Start Date)');
                setEndDateDayOfLabel('Day of week (End Date)');
            } else {
                setStartDateDayOfLabel('Day of month (Start Date)');
                setEndDateDayOfLabel('Day of month (End Date)');
            }
            if(selectedStartDate || selectedEndDate){
                resetOnChange();
            }
            let subType = subscriptionTypeSelection.find(x => x.value === e.target.value).label;
            setBody({
                ...body,
                SubscriptionType: subType
            });
            checkEmptyData();
        } else {
            setIsSubscriptionTypeSelected(false);
            setStartDateDayOfLabel('');
            setEndDateDayOfLabel('');
            resetOnChange();
        }
    }

    const handleChangeStartDate = (date) => {
        setSelectedStartDate(date);
        if(date){
            let startDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            setBody({
                ...body,
                StartDate: startDate
            });
            checkEmptyData();
            if(selectedSubscriptionType === 3){
                setStartDateDayOfValue(date.getDate());
            } else{
                setStartDateDayOfValue(days[date.getDay()])
            }
            setIsStartDateSelected(true);
            setSelectedEndDate(null);
            setEndDateDayOfValue('');
        } else {
            setIsStartDateSelected(false);
            setSelectedEndDate(null);
        }
    }

    const handleChangeEndDate = (date) => {
        setSelectedEndDate(date);
        if(date){
            let endDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            setBody({
                ...body,
                EndDate: endDate
            });
            checkEmptyData();
            if(selectedSubscriptionType === 3){
                setEndDateDayOfValue(date.getDate());
            } else {
                setEndDateDayOfValue(days[date.getDay()])
            }
        }
    }

    const timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleButtonSubmit = async (e) => {
        e.preventDefault();
        setResponsePost([]);
        setIsSending(true);
        await timeout(2000);
        const response = await fetch('/api/createsubscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseBody = await response.json();
        setResponsePost(responseBody);
        setIsSending(false);
    }

    return (
        <div className="App">
            <header className="App-header">
                <Container component="main" maxWidth="md">
                    <Grid container>
                        <Grid item xs={12}>
                            <Card className={cx(classes.card, cardShadowStyles.root)} style={{marginTop: 58}}>
                                <CardHeader
                                    className={cx(classes.overrideHeader, cardHeaderShadowStyles.root)}
                                    classes={cardHeaderStyles}
                                    title={"Subscription Invoice"}
                                    subheader={"Create subscription for customers' invoice at Ezypay.com"}
                                />
                                <CardContent className={classes.content}>
                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Amount"
                                                error={error.Amount}
                                                value={body.Amount}
                                                onChange={handleChangeAmount}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} className={classes.dropDown}>
                                            <Select
                                                fullWidth
                                                value={selectedSubscriptionType}
                                                onChange={handleChangeSubscriptionType}
                                            >
                                                <MenuItem value={0}>Please select a subscription type</MenuItem>
                                                {subscriptionTypeSelection.map(item => {
                                                    return <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Select>
                                        </Grid>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid item md={6} xs={12}>
                                                <KeyboardDatePicker
                                                    fullWidth
                                                    label="Please select a start date"
                                                    format="dd/MM/yyyy"
                                                    variant="inline"
                                                    minDate={minStartDate} 
                                                    disabled={!isSubscriptionTypeSelected}
                                                    value={selectedStartDate}
                                                    onChange={handleChangeStartDate}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <KeyboardDatePicker
                                                    fullWidth
                                                    label="Please select an end date"
                                                    format="dd/MM/yyyy"
                                                    variant="inline"
                                                    minDate={minEndDate} 
                                                    maxDate={maxDate}
                                                    disabled={!isStartDateSelected}
                                                    value={selectedEndDate}
                                                    onChange={handleChangeEndDate}
                                                    onOpen={onEndDateOpen}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label={startDateDayOfLabel}
                                                disabled={true}
                                                value={startDateDayOfValue}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label={endDateDayOfLabel}
                                                disabled={true}
                                                value={endDateDayOfValue}
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                disabled={disableSubmit || error.Amount || !selectedSubscriptionType || !selectedStartDate || !selectedEndDate}
                                                className={classes.submitButton}
                                                onClick={handleButtonSubmit}
                                            >
                                                Create Subscription
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
                <img src={logo} className="App-logo" alt="logo" />
                <Container component="main" maxWidth="md">
                    <Grid container>
                        <Grid item xs={12}>
                            <Card className={cx(classes.card, cardShadowStyles.root)}  style={{marginTop: 50}}>
                                <CardHeader
                                    className={cx(classes.overrideHeader, cardHeaderShadowStyles.root)}
                                    classes={cardHeaderStyles}
                                    title={"Output Details"}
                                    subheader={responseGet}
                                />
                                <CardContent className={classes.content}>
                                    <Grid item md={12} xs={12}>
                                        <table className={classes.table}>
                                            <thead>
                                                <tr>
                                                    <th width="20%">
                                                        Amount
                                                    </th>
                                                    <th width="25%">
                                                        Subscription Type
                                                    </th>
                                                    <th width="55%">
                                                        Invoice Dates
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {   responsePost.length > 0
                                                        ?   responsePost.map((item, index) => (
                                                                index === 0 
                                                                ?   <Fragment key={index}>
                                                                        <td>
                                                                            {item.Amount}
                                                                        </td>
                                                                        <td>
                                                                            {item.SubscriptionType}
                                                                        </td>
                                                                    </Fragment>
                                                                :   <Fragment key={index}>
                                                                        <td>
                                                                            {item.invoiceDates.join(', ')}
                                                                        </td>
                                                                    </Fragment>
                                                        ))
                                                        :   <td colSpan="3">
                                                                <div className={classes.wrapper}>
                                                                    {isSending && <LinearProgress className={classes.linearProgress} />}
                                                                </div>
                                                            </td>
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Grid> 
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </header>
        </div>
    );
}

export default App;